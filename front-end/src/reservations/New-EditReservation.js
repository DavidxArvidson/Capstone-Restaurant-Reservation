import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation, listReservations, readReservation } from "../utils/api";

export default function NewEditReservation({ loadDashboard, edit }) {
	const history = useHistory();
	const { reservation_id } = useParams();
	const [reservationsError, setReservationsError] = useState(null);
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	});
	const [errors, setErrors] = useState([]);
	const [apiError, setApiError] = useState(null);

	useEffect(() => {
		if (edit) {
			if (!reservation_id) return null;

			readReservation(reservation_id)
				.then(fill);
		}

		function fill(foundReservation) {
			if (!foundReservation || foundReservation.status !== "booked") {
				return <p>Only existing reservations can be edited.</p>;
			}

			const date = new Date(foundReservation.reservation_date);
			const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;
	
			setFormData({
				first_name: foundReservation.first_name,
				last_name: foundReservation.last_name,
				mobile_number: foundReservation.mobile_number,
				reservation_date: dateString,
				reservation_time: foundReservation.reservation_time,
				people: foundReservation.people,
			});
		}
	}, [edit, reservation_id]);

	function handleChange({ target }) {
		setFormData({ ...formData, [target.name]: target.name === "people" ? Number(target.value) : target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		const abortController = new AbortController();

		const foundErrors = [];
		if (validateFields(foundErrors) && validateDate(foundErrors)) {
			if (edit) {
				editReservation(reservation_id, formData, abortController.signal)
					.then(loadDashboard)
					.then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
					.catch(setApiError);
			}
			else {
				createReservation(formData, abortController.signal)
					.then(loadDashboard)
					.then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
					.catch(setApiError);
			}
		}

		setErrors(foundErrors);

		return () => abortController.abort();
	}

	function validateFields(foundErrors) {
		for (const field in formData) {
			if (formData[field] === "") {
				foundErrors.push({ message: `${field.split("_").join(" ")} cannot be left blank.`})
			}
		}

		return foundErrors.length === 0;
	}

	
	function validateDate(foundErrors) {
		const reserveDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
		const todaysDate = new Date();
		
		if (reserveDate.getDay() === 1) {
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

		return foundErrors.length === 0;
	}

	const collectErrors = () => {
		return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
	}

	return (
		<form>
			{collectErrors()}
			<ErrorAlert error={apiError} />
			<ErrorAlert error={reservationsError} />

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