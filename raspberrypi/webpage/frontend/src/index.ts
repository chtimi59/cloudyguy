import './index.scss';
import AppRoot from './appRoot';

if (!__PROD__) {
   console.log('---------------------------------------');
   console.log(new Date());
   console.log(`This app is version ${__VERSION__}`);
   if (module.hot) module.hot.accept();
}

new AppRoot()
