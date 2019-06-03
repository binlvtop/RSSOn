const PRODUCTION_CONFIG = {
  API_USER: 'http://k7j9dn.natappfree.cc',
};

const DEVELOPMENT_CONFIG = {
  API_USER: 'http://k7j9dn.natappfree.cc',
}

export default function (env) {
  return function get (key) {
    if (env === 'development') {
      return DEVELOPMENT_CONFIG[key]
    } else {
      return PRODUCTION_CONFIG[key]
    }
  }
}
