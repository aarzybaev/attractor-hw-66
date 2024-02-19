import {Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Meals from './containers/Meals/Meals';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import NewMeal from './containers/NewMeal/NewMeal';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Meals/>}/>
      <Route path="/meals/new" element={<NewMeal/>}/>
      <Route path="/meals/edit/:id" element={<NewMeal isEdit={true}/>}/>
      <Route path="*" element={<PageNotFound/>}/>
    </Routes>
  </Layout>
);

export default App;
