import nextra from 'nextra'

const withNextra = nextra({
  // Tutaj v4 nie przyjmuje już 'theme' ani 'themeConfig'.
  // Możesz tu zostawić pusty obiekt {} lub dodać np. latex: true
})

export default withNextra({
  // Tutaj Twoja standardowa konfiguracja Next.js
  reactStrictMode: true,
})