package main

func NewFile(fd int , name s t ri n g) *File {
i f fd < 0 {
re tu rn nil
}
f := new(File)
f.fd = fd
f.name = name
f.dirinfo = nil
f.nepipe = 0
re tu rn f }