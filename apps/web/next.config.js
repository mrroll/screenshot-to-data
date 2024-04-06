const withConfig = require('@pluslabs/style-guide/next');

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    experimental: {
      typedRoutes: true,
    },
  };

  return withConfig(config);
};
