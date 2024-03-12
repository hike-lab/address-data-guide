<template>
    <div style="display: flex; justify-content: flex-end;">
        <a target="_blank"
            href="https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1uRR7MA8VW8TE8mveK2tjwcW3BCyp_NIB18MG9RxOYNw&font=Default&lang=ko&initial_zoom=2&height=800">
            <img src="/static/icon/expand.png" style="width: 20px; height: 20px;" />
        </a>
    </div>
    <div id="timeline-embed" style="width: 100%; height: 500px">
    </div>
</template>

<script setup>
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import { onMounted, onUpdated } from 'vue';

var additionalOptions = { font: "./style.css", default_bg_color: "#f9fafb", script_path: "./style.css" }
onMounted(() => {
    new Timeline('timeline-embed',
        'https://docs.google.com/spreadsheets/d/1uRR7MA8VW8TE8mveK2tjwcW3BCyp_NIB18MG9RxOYNw/edit#gid=0', additionalOptions);

})

</script>
<style>
html,
body {
    height: 100%;
    padding: 0px;
    margin: 0px;
}

section {
    padding: 0px 0;
}

button.tl-slidenav-content-container {
    color: #3a3a3c;
}
</style>
