### 问题
在使用 `docker` 时，通过 `exec` 进入容器后，做了一些操作，然后重启容器后，发现容器无法启动了，这时候，无法通过 `exec` 进入容器，该如何解决呢？

### 背景
由于最开始没有把 nginx 的根配置挂载到数据卷中，导致在修改 `http`配置时，通过`exec`进入我的`nginx`容器中进行修改后重启容器，由于配置有错误，导致容器一直无法启动

### 方案

> 结论先行：解决方案有两种，我选择的是第二种
>>- `把问题容器用docker commit提交到一个新的镜像，然后用docker run -i -d基于新镜像运行一个临时终端进去改变配置文件，然后把临时终端的id提交到一个新的镜像，然后在基于新的镜像重新启动容器。（这个方法步骤多，而且提交了新的镜像，对于后续维护增加了复杂性）`
>>- `直接在外部服务器中改变容器里的配置文件，不需要新提交镜像`

### 解决步骤

1. `find / -name 'nginx.conf'`查看服务器中所有 nginx.confi 的配置文件地址，获取到如下输出
```javascript
/var/lib/snapd/snap/certbot/3700/lib/python3.8/site-packages/certbot_nginx/_internal/tests/testdata/etc_nginx/nginx.conf
/var/lib/snapd/snap/certbot/3700/lib/python3.8/site-packages/certbot_nginx/_internal/tests/testdata/etc_nginx/ubuntu_nginx_1_4_6/default_vhost/nginx/nginx.conf
/var/lib/snapd/snap/certbot/3834/lib/python3.8/site-packages/certbot_nginx/_internal/tests/testdata/etc_nginx/nginx.conf
/var/lib/snapd/snap/certbot/3834/lib/python3.8/site-packages/certbot_nginx/_internal/tests/testdata/etc_nginx/ubuntu_nginx_1_4_6/default_vhost/nginx/nginx.conf
/var/lib/docker/overlay2/d98c9bd27a9f8d1ee9c9f0392a438243043922716dc9521dfc32d6c1298db027/diff/etc/nginx/nginx.conf
/var/lib/docker/overlay2/d98c9bd27a9f8d1ee9c9f0392a438243043922716dc9521dfc32d6c1298db027/merged/etc/nginx/nginx.conf
/var/lib/docker/overlay2/4379cea9a253b3f125f6909f77efa1bdd33721fcf49d3014e9510ae0fc739d0b/diff/etc/nginx/nginx.conf
/var/lib/docker/overlay2/2a81e7d2f85f1e914a844b25516287fba782883d709eb64db3f40e19cc04a718/diff/etc/nginx/nginx.conf
/root/nginx.conf
/home/onpremise/nginx/nginx.conf
```
2. 通过查看，可以发现和 `docker` 相关的位于最后几项，通过排查法挨个查找，发现`/var/lib/docker/overlay2/d98c9bd27a9f8d1ee9c9f0392a438243043922716dc9521dfc32d6c1298db027/merged/etc/nginx/nginx.conf`是nginx 容器中配置项
3. 修复错误配置，重启nginx 容器，正常运行，到此解决～

___

### extra

关于 docker 问题的定位，可以通过 `docker logs [容器名]`，来先定位问题，判断是什么原因导致的错误，然后再进行修复