import React, {useCallback, useEffect, useState} from 'react';
import axiosAPI from '../../axiosAPI';
import {ApiMeals, Meal} from '../../type';
import TotalCalories from '../../components/TotalCalories/TotalCalories';
import {useLocation, useNavigate} from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import ButtonSpinner from '../../components/ButtonSpinner/ButtonSpinner';

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const fetchMeals = useCallback(async () => {
    if (location.pathname === '/') {
      try {
        setIsLoading(true);
        const {data: meals} = await axiosAPI.get<ApiMeals | null>('/meals.json');
        if (meals) {
          setMeals(Object.keys(meals).map(id => ({
            ...meals[id],
            id
          })));
        } else {
          setMeals([]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }

  }, [location]);

  useEffect(() => {
    void fetchMeals();
  }, [fetchMeals]);

  const deleteMeal = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        setIsDeleting(true);
        await axiosAPI.delete('/meals/' + id + '.json');
      } catch (e) {
        console.log(e);
      } finally {
        setIsDeleting(false);
        navigate('/');
      }
    }

  };

  let mealsArea = <Spinner/>;
  if (!isLoading) {
    mealsArea = (
      <div className="col-8 m-auto mt-3">
        <TotalCalories meals={meals}/>
        {meals.map(meal => {
          return (
            <div key={Math.random()} className="card mt-1">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="card-title text-secondary">{meal.mealTime}</h5>
                    <p className="card-text">{meal.description}</p>
                  </div>
                  <div className="ms-auto me-5">
                    <span className="fw-bold">{meal.calorie} kcal</span>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate('/meals/edit/' + meal.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setId(meal.id);
                        void deleteMeal(meal.id);
                      }}
                      disabled={isDeleting && (id === meal.id)}
                    >
                      {isDeleting && (id === meal.id) && <ButtonSpinner/>}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return mealsArea;
};

export default Meals;