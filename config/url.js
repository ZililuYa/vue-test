import env from './env'

const DEV_URL = 'https://www.easy-mock.com/mock/5d01ee624a0cab501ee0aaea/inspiry'
const PRO_URL = 'https://produce.com'

export default env === 'development' ? DEV_URL : PRO_URL
