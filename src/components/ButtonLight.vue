<template>
    <button><slot></slot></button>
</template>

<style scoped lang="scss">
    button {
        background-color: var(--color-accent-blue);
        color: var(--color-light);
        font-family: inherit;
        padding: 5px 28px;
        margin: 5px;
        border: none;
        border-radius: 4px;
        font-size: 2rem;
        transition: .25s;
        cursor: pointer;

        &:hover {
            // background-color: color-mix(in srgb, var(--color-accent-blue) 50%, var(--color-accent-red) 50%);
            background-color: var(--color-accent-orange);
        }
    }
</style>