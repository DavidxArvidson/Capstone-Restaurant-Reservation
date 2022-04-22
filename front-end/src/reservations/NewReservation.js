import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfReservation, setDateOfReservation] = useState("");
  const [timeOfReservation, setTimeOfReservation] = useState("");
  const [people, setPeople] = useState(1);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
	const abortController = new AbortController();
	const reserveDate = new Date(`${dateOfReservation}T${timeOfReservation}:00.000`);

    if (dateOfReservation < today()) {
      setErrors([...errors, "Past dates not valid!"]);
      return;
    }

	if (reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)) {
	  setErrors([...errors, "Reservation cannot be made: Restaurant is not open until 10:30AM."]);
      return;
	}

	if (reserveDate.getHours() > 22 || (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)) {
		setErrors([...errors, "Reservation cannot be made: Restaurant is closed after 10:30PM."]);
		return;
	}

	if (reserveDate.getHours() > 21 || (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)) {
		setErrors([...errors, "Reservation cannot be made: Reservation must be made at least an hour before closing (10:30PM)."]);
		return;
	}

    let newDate = new Date(dateOfReservation);
    let dayOfWeek = newDate.getDay();
    if (dayOfWeek === 1) {
      setErrors([...errors, "Restaurant is closed on Tuesdays!"]);
      return;
    }
    const reservationObj = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      reservation_date: dateOfReservation,
      reservation_time: timeOfReservation,
      people: parseInt(people),
    };

    if (errors.length === 0) {
      createReservation(reservationObj)
				.then(({ reservation_date }) => history.push(`/dashboard?date=${formatAsDate(reservation_date)}`))
				.catch(setApiError);
    }

	return () => abortController.abort();
  };

	const handleFirstName = (e) => {
    	setFirstName(e.target.value);
  	};
  	const handleLastName = (e) => {
    	setLastName(e.target.value);
  	};
  	const handleMobileNumber = (e) => {
    	setMobileNumber(e.target.value);
  	};
  	const handleDateOfReservation = (e) => {
    	setDateOfReservation(e.target.value);
  	};
  	const handleTimeOfReservation = (e) => {
    	setTimeOfReservation(e.target.value);
  	};
  	const handlePeople = (e) => {
    	setPeople(e.target.value);
  	};

	const errorsJSX = () => {
		return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
	};

  return (
		<form>
			{errorsJSX()}
			<ErrorAlert error={apiError} />

			<label className="form-label" htmlFor="first_name">First Name:&nbsp;</label>
			<input
				className="form-control"
				name="first_name"
				id="first_name"
				type="text"
				onChange={handleFirstName}
				value={firstName}
				required
			/>

			<label className="form-label" htmlFor="last_name">Last Name:&nbsp;</label>
			<input 
				className="form-control"
				name="last_name"
				id="last_name"
				type="text"
				onChange={handleLastName}
				value={lastName}
				required
			/>

			<label className="form-label" htmlFor="mobile_number">Mobile Number:&nbsp;</label>
			<input 
				className="form-control"
				name="mobile_number"
				id="mobile_number"
				type="text"
				onChange={handleMobileNumber}
				value={mobileNumber}
				required
			/>

			<label className="form-label" htmlFor="reservation_date">Reservation Date:&nbsp;</label>
			<input 
				className="form-control"
				name="reservation_date" 
				id="reservation_date"
				type="date"
				onChange={handleDateOfReservation}
				value={dateOfReservation}
				required
			/>

			<label className="form-label" htmlFor="reservation_time">Reservation Time:&nbsp;</label>
			<input 
				className="form-control"
				name="reservation_time" 
				id="reservation_time"
				type="time"
				onChange={handleTimeOfReservation}
				value={timeOfReservation}
				required
			/>

			<label className="form-label" htmlFor="people">Party Size:&nbsp;</label>
			<input 
				className="form-control"
				name="people"
				id="people"
				type="number"
				min="1"
				onChange={handlePeople}
				value={people}
				required
			/>

			<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
			<button type="button" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
	</form>
	);
}