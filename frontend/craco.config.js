// craco.config.js
// Nota: react-scripts 5 detecta tailwind.config.js automaticamente y ya
// activa tailwindcss + autoprefixer en su propia configuracion de PostCSS
// (ver useTailwind en node_modules/react-scripts/config/webpack.config.js).
// No hace falta (ni conviene) sobreescribir la config de PostCSS aqui: mezclar
// los plugins nativos (definidos como strings) con instancias ya invocadas
// rompia el pipeline completo y ninguna clase de Tailwind se generaba.
module.exports = {}
