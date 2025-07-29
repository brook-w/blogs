---
title: Cobbler
date: 2023-08-18 11:06:42
permalink: /pages/c56f3d/
categories:
  - Ceph
tags:
  - 
author: 
  name: brook-w
  link: https://github.com/brook-w
---

Cobbler
https://www.cnblogs.com/yanjieli/p/11016825.html


dnf module enable cobbler:3.3 
会出现 dhcp 无法渲染得问题
没有：generating /etc/dhcp/dhcpd.conf

这是生成得配置文件

```
# ******************************************************************
# Cobbler managed dhcpd.conf file
# generated from cobbler dhcp.conf template (Wed Aug 16 12:38:48 2023)
# Do NOT make changes to /etc/dhcpd.conf. Instead, make your changes
# in /etc/cobbler/dhcp.template, as /etc/dhcpd.conf will be
# overwritten.
# ******************************************************************


ddns-update-style interim;

allow booting;
allow bootp;

ignore client-updates;
set vendorclass = option vendor-class-identifier;

option system-arch code 93 = unsigned integer 16;

subnet 10.0.0.0 netmask 255.255.255.0 {
     option routers             10.0.0.2;
     option domain-name-servers 192.168.1.1;
     option subnet-mask         255.255.255.0;
     range dynamic-bootp        10.0.0.100 10.0.0.110;
     default-lease-time         21600;
     max-lease-time             43200;
     next-server                10.0.0.200;
     class "pxeclients" {
          match if substring (option vendor-class-identifier, 0, 9) = "PXEClient";

          # Legacy
          if option system-arch = 00:00 {
              filename "grub/grub.0";
          }
          # UEFI-32-1
          if option system-arch = 00:06 {
               # Not supported, no 32 bit UEFI grub executable
              filename "unsupported";
          }
          # UEFI-32-2
          if option system-arch = 00:02 {
              # Not supported, no 32 bit UEFI grub executable
              filename "unsupported";
          }
          # UEFI-64-1
          else if option system-arch = 00:07 {
              filename "grub/grubx64.efi";
          }
          # UEFI-64-2
          else if option system-arch = 00:08 {
              filename "grub/grubx64.efi";
          }
          # UEFI-64-3
          else if option system-arch = 00:09 {
              filename "grub/grubx64.efi";
          }
          # armv7   (aka arm 32 bit)
          else if option system-arch = 00:0a {
              filename "grub/armv7.efi";
          }
          # aarch64 (aka arm 64 bit)
          else if option system-arch = 00:0b {
              filename "grub/grubaa64.efi";
          }
          # RiskV 32 bit
          else if option system-arch = 00:25 {
              #ToDo petitboot loader
              filename "unsupported";
          }
          #RiskV 32 bit
          else if option system-arch = 00:27 {
              #ToDo petitboot loader
              filename "unsupported";
          }
          else if option system-arch = 00:0e {
              filename "grub/grub.ppc64le";
          }
          else
          {
              filename "grub/grub.0";
          }
     }
}

    # group for Cobbler DHCP tag: default
    group {
}
```



/var/lib/cobbler/templates


IPMI
https://www.cnblogs.com/TonvyLeeBlogs/articles/13800078.html


修改cobbler中安装系统时20秒后默认local启动
https://blog.csdn.net/weixin_44341722/article/details/129852200#:~:text=%E4%BF%AE%E6%94%B9cobbler%E4%B8%AD%E5%AE%89%E8%A3%85%E7%B3%BB%E7%BB%9F%E6%97%B620%E7%A7%92%E5%90%8E%E9%BB%98%E8%AE%A4local%E5%90%AF%E5%8A%A8%201%201.%E5%90%AF%E5%8A%A8%E8%8F%9C%E5%8D%95%E4%BF%A1%E6%81%AF%20%E5%9C%A8%E5%90%AF%E5%8A%A8%E8%8F%9C%E5%8D%95%E9%87%8C%E9%9D%A2%EF%BC%8Clocal%E6%98%AF%E9%BB%98%E8%AE%A4%E9%80%89%E9%A1%B9%EF%BC%8C%E4%B9%8B%E5%90%8E%E6%89%8D%E6%98%AF%E6%88%91%E4%BB%AC%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9A%84%E5%90%AF%E5%8A%A8%E9%A1%B9%EF%BC%8C%E5%9C%A8%E4%B8%8B%E9%9D%A2%E7%9A%84%E6%A8%A1%E6%9D%BF%E4%B8%AD%E5%8F%AF%E4%BB%A5%E7%9C%8B%E5%87%BAONTIMEOUT%20%E8%B6%85%E6%97%B6%E5%90%8E%E4%BC%9A%E4%BB%A5%24pxe_timeout_profile%E8%BF%99%E4%B8%AA%E5%8F%98%E9%87%8F%E7%9A%84%E5%80%BC%E6%9D%A5%E5%90%AF%E5%8A%A8%20%5Broot%40cobbler%20kickstarts%5D%20%23,...%203%203.%E6%89%A9%E5%B1%95%20%E5%A6%82%E6%9E%9C%E8%A6%81%E9%9A%90%E8%97%8Flocal%E9%80%89%E9%A1%B9%EF%BC%8C%E8%BF%98%E5%8F%AF%E4%BB%A5%E6%8A%8Alocal%E9%82%A3%E5%9B%9B%E8%A1%8C%E5%A4%87%E6%B3%A8%E6%8E%89%20%E8%BF%98%E6%9C%8910%E7%A7%92%E5%86%85%E5%90%AF%E5%8A%A8%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%8A%8ATIMEOUT%E5%90%8E%E7%9A%84200%E6%94%B9%E6%88%90100%20...%204%204.%E7%BB%93%E6%9E%9C



```
cat /etc/cobbler/boot_loader_conf/pxedefault.template

DEFAULT menu
PROMPT 0
MENU TITLE Cobbler | https://cobbler.github.io
TIMEOUT 200
TOTALTIMEOUT 6000
ONTIMEOUT $pxe_timeout_profile

LABEL local
        MENU LABEL (local)
        MENU DEFAULT
        LOCALBOOT -1

$pxe_menu_items

MENU end
```

### 添加默认启动项目
cobbler system add --name=default --profile=CentOS-8-x86_64
cobbler system list
cobbler sync

cat /var/lib/tftpboot/pxelinux.cfg/default



管理发行版
mount -o loop CentOS-7-x86_64-Minimal-2207-02.iso /centos7
cobbler import --path=/centos7/ --name=Centos7 --arch=x86_64
cobbler list 
cobbler distro report --name Centos7-x86_64

生成 kk start
cobbler profile get-autoinstall --name Centos7-x86_64 > /var/lib/cobbler/templates/centos7.ks
cat /var/lib/cobbler/templates/centos7.ks

生成密码 替换密码
openssl passwd -1 'root'
$1$.DVJh7Io$faMJxyumbFssbKzG6R/cP1
vi /var/lib/cobbler/templates/centos7.ks
firewall --disabled    //防火墙关闭
%packages
@core   //设置为最小化安装
%end


验证语法错误

cobbler validate-autoinstalls

# 指定 Profile 信息
cobbler profile edit --name Centos7-x86_64 --autoinstall centos7.ks
cobbler profile edit --name Centos7-x86_64 --kernel-options='net.ifnames=0 biosdevname=0'
cobbler profile report --name Centos7-x86_64

## 同步
cobbler sync 

## 重启
systemctl restart httpd cobblerd rsyncd dhcpd


## 制作 grub 文件

```
ls /usr/share/cobbler/bin/
bash /usr/share/cobbler/bin/mkgrub.sh   # 执行时会有报错 但不影响
ll /var/lib/cobbler/loaders/
grub //新增文件 开机会需要
ldlinux.c32 -> /usr/share/syslinux/ldlinux.c32  //新增文件
menu.c32
pxelinux.0
```

mount -o loop CentOS-8.3.2011-x86_64-minimal_2.iso /centos8
cobbler import --path=/centos8/ --name=Centos8 --arch=x86_64
cobbler list 
cobbler distro report --name Centos8-x86_64

# cobbler profile get-autoinstall --name Centos8-x86_64 > /var/lib/cobbler/templates/centos8.ks
cobbler validate-autoinstalls
cobbler profile edit --name Centos8-x86_64 --autoinstall centos8.ks
cobbler profile edit --name Centos8-x86_64 --kernel-options='net.ifnames=0 biosdevname=0'
cobbler profile report --name Centos8-x86_64
```

# cobbler 配置目录
cd /etc/cobbler

# cobbler 其他配置（多看看）
cd  cd 



删除遗留 local 选项
mv local_legacy.cfg local_legacy.cfg.bak




/var/lib/cobbler/grub_config/grub/grub.cfg

[root@localhost grub]# grep -r 'menu_items.cfg' /usr
Binary file /usr/lib/python3.6/site-packages/cobbler/__pycache__/tftpgen.cpython-36.opt-1.pyc matches
Binary file /usr/lib/python3.6/site-packages/cobbler/__pycache__/tftpgen.cpython-36.pyc matches
/usr/lib/python3.6/site-packages/cobbler/tftpgen.py:            #    outfile = os.path.join(self.bootloc, "grub", "{0}_menu_items.cfg".format(arch))

[root@localhost grub]# grep -r 'menu_items.cfg' /lib
Binary file /lib/python3.6/site-packages/cobbler/__pycache__/tftpgen.cpython-36.opt-1.pyc matches
Binary file /lib/python3.6/site-packages/cobbler/__pycache__/tftpgen.cpython-36.pyc matches
/lib/python3.6/site-packages/cobbler/tftpgen.py:            #    outfile = os.path.join(self.bootloc, "grub", "{0}_menu_items.cfg".format(arch))



submenu 'Centos7-x86_64' --class gnu-linux --class gnu --class os {
    menuentry 'Centos7-x86_64' --class gnu-linux --class gnu --class os {
    echo 'Loading kernel ...'
    clinux /images/Centos7-x86_64/vmlinuz $k_console  net.ifnames=0 biosdevname=0  inst.ks.sendmac inst.ks=http://10.0.0.200/cblr/svc/op/autoinstall/profile/Centos7-x86_64
    echo 'Loading initial ramdisk ...'
    cinitrd /images/Centos7-x86_64/initrd.img
    }

    menuentry 'default' --class gnu-linux --class gnu --class os {
    echo 'Loading kernel ...'
    clinux /images/Centos7-x86_64/vmlinuz $k_console  net.ifnames=0 biosdevname=0  inst.ks.sendmac inst.ks=http://10.0.0.200/cblr/svc/op/autoinstall/profile/default
    echo 'Loading initial ramdisk ...'
    cinitrd /images/Centos7-x86_64/initrd.img
    }

}
submenu 'Centos8-x86_64' --class gnu-linux --class gnu --class os {
    menuentry 'Centos8-x86_64' --class gnu-linux --class gnu --class os {
    echo 'Loading kernel ...'
    clinux /images/Centos8-x86_64/vmlinuz $k_console  net.ifnames=0 biosdevname=0  inst.ks.sendmac inst.ks=http://10.0.0.200/cblr/svc/op/autoinstall/profile/Centos8-x86_64
    echo 'Loading initial ramdisk ...'
    cinitrd /images/Centos8-x86_64/initrd.img
    }
}


修改 collber tftpgen 生成代码

```
/usr/lib/python3.9/site-packages/cobbler/tftpgen.py

# 加入
arch_menu_items['grub'] =  """
menuentry 'default' --class gnu-linux --class gnu --class os {
  echo 'Loading kernel ...'
  clinux /images/Centos7-x86_64/vmlinuz $k_console  net.ifnames=0 biosdevname=0  inst.ks.sendmac inst.ks=http://10.0.0.200/cblr/svc/op/autoinstall/profile/default
  echo 'Loading initial ramdisk ...'
  cinitrd /images/Centos7-x86_64/initrd.img
}

# Write the grub menu:
        for arch in utils.get_valid_archs():
            arch_menu_items = self.get_menu_items(arch)
            if(arch_menu_items['grub']):

                arch_menu_items['grub'] =  """
menuentry 'default' --class gnu-linux --class gnu --class os {
  echo 'Loading kernel ...'
  clinux /images/Centos7-x86_64/vmlinuz $k_console  net.ifnames=0 biosdevname=0  inst.ks.sendmac inst.ks=http://10.0.0.200/cblr/svc/op/autoinstall/profile/default
  echo 'Loading initial ramdisk ...'
  cinitrd /images/Centos7-x86_64/initrd.img
}
""" + arch_menu_items['grub']

                outfile = os.path.join(self.bootloc, "grub", "{0}_menu_items.cfg".format(arch))
                fd = open(outfile, "w+")
                fd.write(arch_menu_items['grub'])
                fd.close()
```
重启服务生效

systemctl  restart cobblerd &&  systemctl  status  cobblerd


修改请求时间

vim /var/lib/cobbler/grub_config/grub
set timeout=10

## cobbler windows 安装
https://zhuanlan.zhihu.com/p/465473984
https://anjia0532.github.io/2019/02/22/cobbler-win10-win-server-2019/
https://blog.csdn.net/qq_43652666/article/details/119175635


DELL R740XD 性能
https://zhuanlan.zhihu.com/p/493852946

## nmcli 命令
https://zhuanlan.zhihu.com/p/395236748

vmware 磁盘扩容
https://blog.csdn.net/weixin_43744059/article/details/109612543


vmware 转 qcow2
https://blog.csdn.net/mofeimo110/article/details/121914841

# build win qcow2
https://www.phillipsj.net/posts/building-a-windows-server-qcow2-image/