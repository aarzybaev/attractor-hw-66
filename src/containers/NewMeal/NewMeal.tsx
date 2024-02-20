import React, {useCallback, useEffect, useState} from 'react';
import {ApiMeal} from '../../type';
import {useNavigate, useParams} from 'react-router-dom';
import {MEAL_TIME} from '../../constants';
import axiosAPI from '../../axiosAPI';
import ButtonSpinner from '../../components/ButtonSpinner/ButtonSpinner';
import Spinner from '../../components/Spinner/Spinner';

interface Props {
  isEdit?: boolean;
}

interface Meal {
  calorie: string;
  description: string;
  mealTime: string;
  createdAt: string;
}

const NewMeal: React.FC<Props> = ({isEdit = false}) => {
  const [meal, setMeal] = useState<Meal>({
    calorie: '',
    description: '',
    mealTime: 'Breakfast',
    createdAt: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);


  const navigate = useNavigate();
  const toCreateMeal = async (meal: ApiMeal) => {
    try {
      setIsCreating(true);
      await axiosAPI.post<ApiMeal | null>('/meals.json', meal);
    } catch (e) {
      console.log(e);
    } finally {
      setIsCreating(false);
    }
  };

  const toEditeMeal = async (id: string, meal: ApiMeal) => {
    try {
      setIsEditing(true);
      await axiosAPI.put<ApiMeal | null>('/meals/' + id + '.json', meal);
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
    }
  };

  const {id} = useParams();

  const fetchMeal = useCallback(async () => {
    try {
      setIsLoading(true);
      const {data: meal} = await axiosAPI.get<ApiMeal | null>('/meals/' + id + '.json');
      if (meal) {
        setMeal({...meal, calorie: meal.calorie.toString()});
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

  }, []);

  useEffect(() => {
    void fetchMeal();
  }, [fetchMeal]);

  if (id) {
    isEdit = true;
  }
  const changeMeal = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMeal(prevState => (
      {
        ...prevState,
        [e.target.name]: e.target.value
      }
    ));
  };
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && id) {
      await toEditeMeal(id, {...meal, calorie: Number(meal.calorie)});
      
    } else {
      await toCreateMeal({...meal, calorie: Number(meal.calorie)});
      navigate('/');
    }

  };

  const mealTime = MEAL_TIME.map(
    item => {
      if (item === meal.mealTime) {
        return <option key={Math.random()} value={item} selected>{item}</option>;
      }
      return <option key={Math.random()} value={item}>{item}</option>;
    }
  );

  const getCurrDate = () => {
    const today = new Date();    
    const date = today.setDate(today.getDate()); 
    const defaultValue = new Date(date).toISOString().split('T')[0];
    return defaultValue;
  };

  let content = <Spinner/>;

  if (!isLoading) {
    content = (
      <div className="row">
        <form className="col-5 m-auto mt-3" onSubmit={onFormSubmit}>
          <h4>{isEdit ? 'Edit meal' : 'Add new meal'}</h4>
          <div className="form-group">
            <select
              name="mealTime"
              id="mealTime"
              className="form-select"
              onChange={changeMeal}
              required
            >
              {mealTime}
            </select>
          </div>
          <div className="form-group mt-2">
            <input
              type="text"
              name="description"
              id="description"
              className="form-control"
              value={meal.description}
              onChange={changeMeal}
              placeholder="Meal description"
              required
            />
          </div>
          <div className="form-group mt-2">
            <input
              type="number"
              name="calorie"
              id="calorie"
              className="form-control"
              value={meal.calorie ? meal.calorie : ''}
              onChange={changeMeal}
              placeholder="Calories"
              required
            />
          </div>
          <div className="form-group mt-2">
            <input
              type="date"
              name="createdAt"
              id="createdAt"
              className="form-control"              
              value={meal.createdAt ? meal.createdAt : getCurrDate()}
              onChange={changeMeal}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isCreating && !isEditing || !isCreating && isEditing}>
            {isCreating && <ButtonSpinner/> || isEditing && <ButtonSpinner/>}
            Save
          </button>
        </form>
      </div>
    );
  }

  return content;
};

export default NewMeal;