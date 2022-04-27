import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import FormComp from "./FormComp";

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

		for (const field in formData) {
			if (formData[field] === "") {
				foundErrors.push({ message: `${field.split("_").join(" ")} cannot be left blank.`})
			}
		}
	
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

  
  	function handleSubmit(event) {
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
		<FormComp errorsJSX={errorsJSX} apiError={apiError} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} />
	);
}