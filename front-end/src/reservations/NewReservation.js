import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function NewReservation() {
	const history = useHistory();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: 0,
	});

	function handleChange({ target }) {
		setFormData({ ...formData, [target.name]: target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		history.push(`/dashboard?date=${formData.reservation_date}`);
	}

	return (
		<form>
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