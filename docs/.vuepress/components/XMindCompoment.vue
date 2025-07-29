<template>
    <div style="height: 100%;width: 100%;">
        <a style="font-size: 12px" @click="saveFile">download</a>
        <div id="xmind"></div>
    </div>
</template>

<script>
import FileSaver from "file-saver";
export default {
    props: {
        src: "",
    },
    data() {
        return {};
    },
    async mounted() {
        const container = document.querySelector('#xmind')
        const res = await fetch(this.src)
        const viewer = new XMindEmbedViewer({
            el: '#xmind',
            file: await res.arrayBuffer(),
            styles: {
                'height': '600px',
                'width': '100%'
            },
            zoomScale: 80
        })
    },
    methods: {
        async saveFile() {
            const srcArr = this.src.split("/");
            const file = await fetch(this.src).then((res) => res.blob());
            FileSaver.saveAs(file, srcArr[srcArr.length - 1]);
        },
    },
};
</script>

<style></style>