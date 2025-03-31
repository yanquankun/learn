### 本文主要针对 docker 部署 ELK 进行讲解

#### 环境

- 通过 docker-compose 进行部署 ELK 容器
- ELK 版本：`logstash 8.5.0` `elasticsearch 8.5.0` `kibana 8.5.0`
- 本文仅针对测试环境进行实践（不使用安全认证功能）,生产环境不要直接使用
- 个人服务器系统 `centos`
- docker 版本 `24.0.6`
- elasticsearch 的内存分配要大，测试也需要 1g 的内存

#### ELK 介绍

ELK Stack 是由 Elasticsearch, Logstash, 和 Kibana 组成的一个开源数据分析平台，广泛用于搜索、分析和可视化日志数据。它们可以独立使用，也可以结合在一起形成一个强大的日志收集、分析和监控解决方案

#### Elasticsearch

Elasticsearch 是一个基于 Lucene 构建的分布式搜索和分析引擎。它是 ELK Stack 的核心，负责存储、搜索、分析大规模的结构化和非结构化数据。

- `全文搜索` Elasticsearch 支持全文搜索，能够从海量数据中快速找到关键词。
- `实时数据分析` 通过强大的索引和搜索引擎，Elasticsearch 可以对数据进行实时查询和分析。
- `分布式架构` Elasticsearch 支持分布式集群架构，能够处理大规模数据，自动分配和复制数据。
- `强大的查询语言（Query DSL）` 使用 JSON 格式的查询语言，能够进行复杂的过滤、排序、聚合和数据分析。

`用于处理日志、指标、事件数据等。支持强大的实时数据查询和分析，常被用于构建搜索引擎、监控系统等。`

#### logstash

Logstash 是一个强大的数据收集、处理和传输工具。它主要用于接收、处理和转发来自不同源的数据，尤其是在日志处理方面表现优异。Logstash 通过管道（pipeline）将输入数据（比如日志文件、数据库、消息队列等）进行解析、转换和输出到 Elasticsearch 或其他存储系统。

- `数据输入` 支持从多种来源获取数据，如文件、数据库、消息队列、HTTP 接口等
- `数据过滤与转换` 通过内置的过滤器，可以对数据进行解析（如 Grok 解析日志格式）、数据清洗、格式转换等处理。
- `输出到多个目的地` 支持将数据输出到 Elasticsearch、Kafka、文件、数据库等多种目标

`用于日志采集、数据解析和格式化，通常与 Elasticsearch 配合使用,通过配置 输入插件、过滤插件 和 输出插件，Logstash 可以灵活处理各种数据流`

#### Kibana

Kibana 是一个用于可视化和分析 Elasticsearch 中数据的工具。它提供了一个强大的 Web 界面，允许用户创建图表、仪表盘、视图等可视化内容，并执行高级的查询与分析操作。

- `数据可视化` Kibana 提供了多种可视化工具，如图表、饼图、柱状图、地图、表格等，可以将 Elasticsearch 中的数据进行直观展示。
- `仪表盘` 通过 Kibana，用户可以创建交互式仪表盘，实时监控和分析数据。
- `搜索和查询` 通过 Kibana，用户可以直接执行 Elasticsearch 查询，查看数据，并进行筛选、聚合等操作。
- `管理和监控` 提供对 Elasticsearch 集群的监控和管理功能，包括集群健康状况、节点状态等。

`用于将 Elasticsearch 中的数据可视化，帮助用户更直观地分析和监控数据,常用于构建实时日志分析平台、监控系统等`

### 👇🏻 进入正题，给出我的 ELK 配置

```yml
# docker-compose.yml
# volumes是数据挂载卷，可自行配置
version: "3.7"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - network.host=0.0.0.0
      - xpack.security.enabled=false # 禁用安全性
      - xpack.security.http.ssl.enabled=false # 禁用 SSL
    ports:
      - "9200:9200"
    volumes:
      - ./elasticsearch/data:/usr/share/elasticsearch/data
    networks:
      - elk
    deploy:
      resources:
        limits:
          memory: 1g

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    container_name: logstash
    environment:
      - LOGSTASH_JAVA_OPTS=-Xmx512m -Xms512m
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/config:/usr/share/logstash/config
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    networks:
      - elk
    deploy:
      resources:
        limits:
          memory: 512m

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200 # 使用 HTTP 而非 HTTPS
      - SERVER_SSL_ENABLED=false # 禁用 Kibana SSL
    ports:
      - "5601:5601"
    volumes:
      - /root/ELK/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml
    networks:
      - elk
    deploy:
      resources:
        limits:
          memory: 512m

networks:
  elk:
    driver: bridge
```

通过上述配置，可看到，针对 logstash 和 kibana 我做了挂载数据卷，目的是方便配置`kibana.yml`、`pipelines.yml`和`logstash.conf`，下面给出这两个的配置

```yml
# 在/logstash/config新建pipelines.yml
- pipeline.id: main
  path.config: "/usr/share/logstash/pipeline/logstash.conf"

# 在/root/ELK/logstash/pipeline新建logstash.conf
input {
  http {
    # 配置 HTTP 输入插件，监听 HTTP 请求
    host => "0.0.0.0"         # 监听所有网络接口
    port => 5044               # 监听端口
    codec => "json"            # 假设数据是 JSON 格式
  }
}

filter {
  date {
    match => [ "timestamp", "ISO8601" ]
  }
}

output {
  elasticsearch {
    hosts => ["http://[your ip]:9200"]  # Elasticsearch 地址
    index => "logstash-%{+YYYY.MM.dd}"     # 每天一个新的索引
    ssl => false                           # 不使用 SSL
  }

  # 也可以输出到文件进行调试
  stdout {
    codec => rubydebug  # 打印详细调试信息
  }
}
```

```yml
# 在/root/ELK/kibana/config新建kibana.yml文件，其实你不挂载此目录也可以，会自动创建，但不方便我们修改配置
server.host: "0.0.0.0" # 允许从任何主机访问 Kibana
server.port: 5601 # 默认端口为 5601

elasticsearch.hosts: ["http://[your ip]:9200"] # 指向 Elasticsearch 的 HTTP 地址

# 禁用 SSL 配置
server.ssl.enabled: false # 禁用 Kibana 的 SSL 支持

i18n.locale: "zh-CN"
```

通过如上配置，即完成了 ELK 的 docker 配置，我们运行以下命令启动容器

```cmd
docker-compose up -d
```

会看到 logstash、kibana、elasticsearch 三个容器启动成功，通过浏览器访问我们的 es 和 kibana 地址可以看到如下界面即启动成功 😋，接着我们就可以调用我们的 logstash 服务进行日志上报  

- es 界面  
  ![es界面](https://oss.yanquankun.cn/oss-cdn/es.png!watermark)

- kibana 界面
  ![kibana界面](https://oss.yanquankun.cn/oss-cdn/kibana.png!watermark)

```javascript
// 发送一条测试日志，可在kibana UI中进行索引配置后，在discover菜单中可查到该记录
curl -X POST "http://[your ip]:5044" -H "Content-Type: application/json" -d '{
  "timestamp": "2024-12-26T12:00:00Z",
  "message": "This is a log entry",
  "level": "info"
}'
```

### 结尾

当然我们在搭建 ELK 的过程中会遇到一些其他的坑点，但基本网上都可以查到解决方法，对于 kibana 的详细使用，可参考[https://www.elastic.co/guide/en/kibana/8.5/data-views.html](kibana使用文档)，本文不做赘述
