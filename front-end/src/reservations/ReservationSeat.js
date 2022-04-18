import React from "react";

const tableOptions = () => {
    return tables.map((table) => 
        <option value={table.table_id}>{table.table_name} - {table.capacity}</option>);
};

export default function ReservationSeat({ reservations, tables }) {
	const history = useHistory();
	
	const [tableId, setTableId] = useState(0);
	const [errors, setErrors] = useState([]);

	if (!tables || !reservations) return null;

	// change handler sets tableId state
	function handleChange({ target }) {
		setTableId(target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (validateSeat()) {
			history.push(`/dashboard`);
		}
	}
	
	function validateSeat() {
		const foundErrors = [];

		const foundTable = tables.find((table) => table.table_id === tableId);
		const foundReservation = reservations.find((reservation) => reservation.reservation_id === reservation_id);

		if (!foundTable) {
			foundErrors.push("This table does not exist.");
		} else if (!foundReservation) {
			foundErrors.push("This reservation does not exist.")
		} else {
			if (foundTable.status === "occupied") {
				foundErrors.push("This table is occupied.")
			}
            if (foundTable.capacity < foundReservation.people) {
				foundErrors.push(`This table cannot seat ${foundReservation.people} people.`)
			}
		}

		setErrors(foundErrors);

		return foundErrors.length === 0;
	}
    
    return (
		<form>
		    <label htmlFor="table_id">Select table:</label>
		    <select 
	            name="table_id" 
	            id="table_id"
	            value={tableId}
	            onChange={handleChange}
            >
	            {tableOptions()}
            </select>

		    <button type="submit" onClick={handleSubmit}>Submit</button>
		    <button type="button" onClick={history.goBack}>Cancel</button>
	    </form>
	);
}