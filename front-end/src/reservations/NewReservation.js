import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
	first_name: "",
	last_name: "",
	mobile_number: "",
	reservation_date: "",
	reservation_time: "",
	people: "",
  });

  function validateFields() {
	const reserveDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
	const todaysDate = new Date();

	const foundErrors = []
	
	if (reserveDate.getDay() === 2) {
		foundErrors.push({ message: "Unfortunately, we are closed on Tuesdays." });
	}
	if (reserveDate < todaysDate) {
		foundErrors.push({ message: "Reservations cannot be made on a past date." });
	}
	if (reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)) {
		foundErrors.push({ message: "Unfortunately, we are not open until 10:30AM." });
	} else if (reserveDate.getHours() > 22 || (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)) {
		foundErrors.push({ message: "Unfortunately, we close at 10:30PM." });
	} else if (reserveDate.getHours() > 21 || (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)) {
		foundErrors.push({ message: "Unfortunately, reservations must be made at least an hour before we close at 10:30PM." })
	}

	setErrors(foundErrors);

	return foundErrors.length === 0;
}

  
  const handleSubmit = async (event) => {
    event.preventDefault();
	const abortController = new AbortController();

    if (validateFields()) {
      createReservation(formData)
				.then(({ reservation_date }) => history.push(`/dashboard?date=${formatAsDate(reservation_date)}`))
				.catch(setApiError);
    }

	return () => abortController.abort();
  };

  function handleChange({ target }) {
	setFormData({ ...formData, [target.name]: target.name === "people" ? Number(target.value) : target.value });
  }

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
				onChange={handleChange}
				value={formData.first_name}
				required
			/>

			<label className="form-label" htmlFor="last_name">Last Name:&nbsp;</label>
			<input 
				className="form-control"
				name="last_name"
				id="last_name"
				type="text"
				onChange={handleChange}
				value={formData.last_name}
				required
			/>

			<label className="form-label" htmlFor="mobile_number">Mobile Number:&nbsp;</label>
			<input 
				className="form-control"
				name="mobile_number"
				id="mobile_number"
				type="text"
				onChange={handleChange}
				value={formData.mobile_number}
				required
			/>

			<label className="form-label" htmlFor="reservation_date">Reservation Date:&nbsp;</label>
			<input 
				className="form-control"
				name="reservation_date" 
				id="reservation_date"
				type="date"
				onChange={handleChange}
				value={formData.reservation_date}
				required
			/>

			<label className="form-label" htmlFor="reservation_time">Reservation Time:&nbsp;</label>
			<input 
				className="form-control"
				name="reservation_time" 
				id="reservation_time"
				type="time"
				onChange={handleChange}
				value={formData.reservation_time}
				required
			/>

			<label className="form-label" htmlFor="people">Party Size:&nbsp;</label>
			<input 
				className="form-control"
				name="people"
				id="people"
				type="number"
				min="1"
				onChange={handleChange}
				value={formData.people}
				required
			/>

			<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
			<button type="button" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
	</form>
	);
}