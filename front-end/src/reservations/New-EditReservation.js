import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewEditReservation({ edit, reservations }) {
	const history = useHistory();
	const { reservation_id } = useParams();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: 0,
	});
	const [errors, setErrors] = useState([]);

	if (edit) {
		if (!reservations || !reservation_id) {
			return null;
		}
	
		const foundReservation = reservations.find((reservation) => 
			reservation.reservation_id === Number(reservation_id));
	
		if (!foundReservation || foundReservation.status !== "booked") {
			return <p>Only booked reservations can be edited.</p>;
		}

		setFormData({
			reservation_id: foundReservation.reservation_id,
			first_name: foundReservation.first_name,
			last_name: foundReservation.last_name,
			mobile_number: foundReservation.mobile_number,
			reservation_date: foundReservation.reservation_date,
			reservation_time: foundReservation.reservation_time,
			people: foundReservation.people,
		});
	}

	function handleChange({ target }) {
		setFormData({ ...formData, [target.name]: target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (validateDate()) {
			history.push(`/dashboard?date=${formData.reservation_date}`);
		}
	}

	
	function validateDate() {
		const reserveDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
		const todaysDate = new Date();
		const foundErrors = [];
		
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

		setErrors(foundErrors);
		if (foundErrors.length > 0) {
			return false;
		}
		return true;
	}

	const collectErrors = () => {
		return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
	}

	return (
		<form>
			{collectErrors()}
			<label htmlFor="first_name">First Name:&nbsp;</label>
			<input
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

			<button type="submit" onClick={handleSubmit}>Submit</button>
			<button type="button" onClick={history.goBack}>Cancel</button>
	</form>
	);
}