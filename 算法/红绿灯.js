// 红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次；如何让三个灯不断交替重复亮灯？
const resLight = () => {
  console.log("红灯", +new Date());
  setTimeout(() => {
    greenLight();
  }, 3000);
};
const greenLight = () => {
  console.log("绿灯", +new Date());
  setTimeout(() => {
    yellowLight();
  }, 1000);
};
const yellowLight = () => {
  console.log("黄灯", +new Date());
  setTimeout(() => {
    resLight();
  }, 2000);
};

const light = async () => {
  await resLight();
};
light();
// 红灯 1708413091837
// 绿灯 1708413094844
// 黄灯 1708413095845
// 红灯 1708413097847
// 绿灯 1708413100848
// 黄灯 1708413101849
// 红灯 1708413103850
// 绿灯 1708413106851
// 黄灯 1708413107852
// 红灯 1708413109853
