/**
 * List handler for reservation resources
 */

 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

 async function list(req, res) {
	const date = req.query.date;

	const response = await service.list(date);

	res.json({ data: response });
}

async function newRes(req, res) {
	req.body.data.status = "booked";

	const response = await service.newRes(req.body.data);

	res.status(201).json({ data: response[0] });
}

function validateBody(req, res, next) {
	if (!req.body.data) {
		return next({ status: 400, message: "The request body must have a data object" });
	}

	const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

	for (const field of requiredFields) {
		if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
			return next({ status: 400, message: `The '${field}' field is required` });
		}
	}

	if (Number.isNaN(Date.parse(`${req.body.data.reservation_date} ${req.body.data.reservation_time}`))) {
		return next({ status: 400, message: "Either the 'reservation_date' or 'reservation_time' field is in an incorrect format" });
	}

	if (typeof req.body.data.people !== "number") {
		return next({ status: 400, message: "The 'people' field must be in a number format" });
	}

	if (req.body.data.people < 1) {
		return next({ status: 400, message: "The 'people' field must be at least 1" });
	}

	next();
}

function validateDate(req, res, next) {
	const reserveDate = new Date(`${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`);
	const todaysDate = new Date();

	if (reserveDate.getDay() === 1) {  
		return next({ status: 400, message: "Restauraunt is closed on tuesday" });
	}

	if (reserveDate < todaysDate) {
		return next({ status: 400, message: "The time and date of the reservation must be in the future" });
	}

	if (reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)) {
		return next({ status: 400, message: "Restaurant is not open until 10:30AM" });
	}

	if (reserveDate.getHours() > 22 || (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)) {
		return next({ status: 400, message: "Restaurant is closed after 10:30PM" });
	}

	if (reserveDate.getHours() > 21 || (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)) {
		return next({ status: 400, message: "Reservation must be made at least an hour before closing (10:30PM)" })
	}

	next();
}

module.exports = {
	list: asyncErrorBoundary(list),
	newRes: [validateBody, validateDate, asyncErrorBoundary(newRes)],
};