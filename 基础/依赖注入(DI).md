## 背景

Angular 和 NestJS 等框架通过依赖注入（DI）解耦了类之间的关系，使得组件更易测试和维护。我们将使用 TypeScript 装饰器 + `reflect-metadata` 实现一个轻量版的 DI 系统：

- 支持自动注入类（构造函数）
- 支持传入普通构造参数（如 string、number）
- 支持属性注入（`@Inject()`）

下面是一个DI的简单实现

```javascript
import "reflect-metadata";

/**
 * 注册可注入的类（Class -> Class 构造器）
 */
const InjectableRegistry = new Map<Function, any>();

/**
 * 收集可注入的类
 */
function Injectable(): ClassDecorator {
  // target: 被装饰的类本身（如 LoggerService、UserService、AppService）
  return (target) => {
    // 将类注册到可注入的类集合中，key 和 value 都是类的构造器
    // 例如：UserService 会被注册到 InjectableRegistry
    InjectableRegistry.set(target, target);
  };
}

/**
 * 属性注入装饰器
 * 收集需要注入的属性，将其加入到构造函数参数列表中
 */
function InjectProp(): PropertyDecorator {
  // target: 属性所在的原型对象（如 AppService.prototype）
  // key: 属性名（如 'userService'）
  return (target, key) => {
    // 获取属性类型（构造器），如 AppService 的 userService 属性类型是 UserService
    // 这里的 type 是 UserService
    const type = Reflect.getMetadata("design:type", target, key);
    // 在属性上定义元数据，标记需要注入的类型
    Reflect.defineMetadata("custom:inject-prop", type, target, key);

    // 获取类构造函数
    const constructor = target.constructor;
    // 获取已注册的需要注入的属性列表
    // 这里拿到的是AppService的构造器的参数列表，是[]
    const injectedProps =
      Reflect.getOwnMetadata("custom:injected-props", constructor) || [];

    // 如果当前属性还未注册，则加入列表
    // 这里key是userService
    if (!injectedProps.includes(key)) {
      // 将userService加入到AppService的构造器的参数列表中
      Reflect.defineMetadata(
        "custom:injected-props",
        [...injectedProps, key],
        constructor
      );
      // 这里打印的是AppService的构造器参数列表，是[userService]
      console.log(
        `InjectProp：${target.constructor.name}的构造器参数列表`,
        Reflect.getMetadata("custom:injected-props", constructor)
      );
      console.log("--------------------------------");
    }
  };
}

/**
 * 参数注入装饰器
 * 收集需要注入的参数，将其加入到构造函数参数列表中
 * 这里是给UserService的构造函数参数列表中加入userName
 */
function Inject(token: string): ParameterDecorator {
  // 这里的token是userName
  // target: 构造类的本身，这里是UserService
  // parameterIndex: 参数索引（如 1 表示第二个参数）
  return (target, _, parameterIndex) => {
    // 获取已注册的 token 映射
    const tokenMap =
      Reflect.getOwnMetadata("custom:inject-tokens", target) || {};

    // 记录当前参数索引对应的 token
    tokenMap[parameterIndex] = token;
    // 保存到元数据
    Reflect.defineMetadata("custom:inject-tokens", tokenMap, target);
  };
}

/**
 * 判断是否是可注入的类（排除基础类型）
 * 只有非基础类型的函数才认为是可注入的类
 * 通过该方法判断构造函数参数是否为类
 */
function isInjectableClass(type: any): boolean {
  // 基础类型集合
  const primitives = [String, Number, Boolean, Object, Array, Symbol];
  // 只有非基础类型的函数才认为是可注入的类
  return typeof type === "function" && !primitives.includes(type);
}

/**
 * 注入属性依赖
 * 遍历需要注入的属性列表，递归解析并赋值
 */
function injectProperties(instance: any) {
  // 获取实例的构造函数（如 AppService）
  const constructor = instance.constructor;
  // 获取实例的原型对象
  const proto = Object.getPrototypeOf(instance);
  // 获取需要注入的属性列表（如 ["userService"]）
  const injectedProps =
    Reflect.getOwnMetadata("custom:injected-props", constructor) || [];

  console.log(`injectProperties：${constructor.name}的属性列表`, injectedProps);
  console.log("--------------------------------");

  // 遍历所有需要注入的属性
  for (const key of injectedProps) {
    // 获取属性类型（如 UserService）
    const type = Reflect.getMetadata("custom:inject-prop", proto, key);
    // 如果类型可注入，则递归解析并赋值
    if (type && InjectableRegistry.has(type)) {
      // 这里会递归调用 Injector.resolve(UserService)
      instance[key] = Injector.resolve(type);
    }
  }
}

/**
 * 依赖注入容器
 * 提供 provide 方法，用于注册值提供者
 * 提供 resolve 方法，用于解析并实例化目标类
 */
class Injector {
  // token -> value 的映射表
  private static valueProviders = new Map<string, any>();

  // 注册值提供者（如字符串、数字等基础类型）
  static provide(token: string, value: any) {
    this.valueProviders.set(token, value);
  }

  // 解析并实例化目标类
  static resolve<T>(target: new (...args: any[]) => T): T {
    const targetName = target.name;
    console.log(`当前解析的类是${targetName}`);
    // 通过design:paramtypes获取构造函数参数类型数组（如 [LoggerService, String]）
    const paramTypes: any[] =
      Reflect.getMetadata("design:paramtypes", target) || [];
    // 获取参数索引到 token 的映射
    const tokenMap: Record<number, string> =
      Reflect.getMetadata("custom:inject-tokens", target) || {};

    console.log(`${targetName}的构造函数参数列表`, paramTypes);
    console.log(`${targetName}的token映射`, tokenMap);

    // 依次解析每个参数
    const dependencies = paramTypes.map((type, index) => {
      // 如果有 token，则用 token 查找值
      const token = tokenMap[index];
      if (token) {
        // 这里的token是userName
        if (!this.valueProviders.has(token)) {
          throw new Error(`未提供 token '${token}' 的值`);
        }
        return this.valueProviders.get(token);
      }
      // 如果是可注入的类，则递归解析
      if (isInjectableClass(type) && InjectableRegistry.has(type)) {
        return this.resolve(type);
      }
      // 否则抛出无法注入的错误
      throw new Error(`第 ${index + 1} 个参数无法注入：${type?.name || type}`);
    });

    console.log(`${targetName}的依赖`, dependencies);
    console.log("--------------------------------");
    const instance = new target(...dependencies);
    // 注入属性依赖（如 AppService 的 userService）
    injectProperties(instance);
    return instance;
  }
}

// ========== 示例业务代码 =============
@Injectable()
class LoggerService {
  // log 方法用于打印日志
  log(msg: string) {
    console.log("[Logger]", msg);
  }
}

@Injectable()
class UserService {
  name: string;
  // logger: LoggerService 由依赖注入容器自动注入
  // name: string 由 token 注入
  constructor(private logger: LoggerService, @Inject("userName") name: string) {
    this.name = name;
  }

  sayHi() {
    // 这里 logger 已经被注入，name 由 token 提供
    this.logger.log(`${this.name},Hello from UserService`);
  }
}

@Injectable()
class AppService {
  // userService 属性由依赖注入容器自动注入
  @InjectProp()
  userService!: UserService;

  greet() {
    this.userService.sayHi();
  }
}

// ========== 启动注入流程 =============

// 提供 userName 的值
Injector.provide("userName", "张三");
// 解析 AppService，自动注入所有依赖
const app = Injector.resolve(AppService);
app.greet();
// 控制台输出: [Logger] 张三,Hello from UserService

```

