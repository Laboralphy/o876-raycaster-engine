<template>
    <a :href="href">
        <figure class="logo">
            <div class="logo-container">
              <slot></slot>
            </div>
            <figcaption>{{ caption }}</figcaption>
        </figure>
    </a>
</template>

<script>
    export default {
        name: "Logo",
        props: ['src', 'href', 'caption']
    }
</script>

<style scoped>
    figure.logo > div.logo-container {
        padding: 0;
        height: 10em;
        width: 10em;
        overflow: hidden;
        margin: auto;
        text-align: center;
        vertical-align: center;
    }

    figure.logo > div.logo-container > img {
        margin: 0;
        max-width: 10em;
        max-height: 10em;
    }

    figure.logo figcaption {
        text-align: center;
    }

</style>