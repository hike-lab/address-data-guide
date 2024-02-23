<template>
        <div id="timeline-embed" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import { onMounted, onUpdated } from 'vue';
var additionalOptions = {font: "./style.css", default_bg_color:"#f9fafb"}
onMounted(()=>{
   new Timeline('timeline-embed',
            'https://docs.google.com/spreadsheets/d/1uRR7MA8VW8TE8mveK2tjwcW3BCyp_NIB18MG9RxOYNw/edit#gid=0', additionalOptions);
    
})

</script>
