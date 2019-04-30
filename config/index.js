import  getService from './service';
import constant from './constant';

const get = getService(constant.env);

const config = {
  ...constant,
  service: {
    get
  }
}

export default config