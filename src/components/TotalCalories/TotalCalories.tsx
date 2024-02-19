import {Meal} from '../../type';
import React from 'react';
import {useNavigate} from 'react-router-dom';

interface Props {
  meals: Meal[];
}
const TotalCalories: React.FC<Props> = ({meals}) => {
  const navigation = useNavigate();
  const getTotalCalories = (items: Meal[]) => items.reduce((acc, cur) => acc + cur.calorie, 0)
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        Total calories: <span className="fw-bold">{getTotalCalories(meals)} kcal</span>
      </div>
      <button className="btn btn-primary btn-sm" onClick={()=> navigation('/meals/new')}>Add new meal</button>
    </div>
  );
};

export default TotalCalories;