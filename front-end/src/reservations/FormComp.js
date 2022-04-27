import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function FormComp({ errorsJSX, apiError, handleChange, handleSubmit, formData }) {
    const history = useHistory();

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