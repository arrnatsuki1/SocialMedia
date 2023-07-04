export const uuid = document.cookie
    .split("; ")
    .find((row) => row.startsWith("uuid="))
    ?.split("=")[1];