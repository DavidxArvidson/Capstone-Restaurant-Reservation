/**
 * List handler for reservation resources
 */

 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
	const { date, mobile_number } = req.query;
  
	if (mobile_number) {
	  service
		.search(mobile_number)
		.then((data) => res.status(200).json({ data: data }));
	} else {
	  service.list(date).then((data) => {
		const response = data.filter(
		  (r) => r.status !== "finished"
		);
		res.json({ data: response });
	  });
	}
}

async function validateData(req, res, next) {
	if(!req.body.data) {
		return next({ status: 400, message: "The request body must have a data object" });
	}

	next();
}

function validateBody(req, res, next) {
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

	if (req.body.data.status && req.body.data.status !== "booked") {
		return next({ status: 400, message: `The 'status' field cannot be ${req.body.data.status}` });
	}

	next();
}

function validateDate(req, res, next) {
	const reserveDate = new Date(`${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`);
	const todaysDate = new Date();

	if (reserveDate.getDay() === 2) {  
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

async function newRes(req, res) {
	req.body.data.status = "booked";

	const response = await service.newRes(req.body.data);

	res.status(201).json({ data: response[0] });
}

async function validateResId(req, res, next) {
    const { reservation_id } = req.params;
    const reservation = await service.read(Number(reservation_id));

    if (!reservation) {
        return next({ status: 404, message: `That reservation ID: ${reservation_id} does not exist` });
    }

    res.locals.reservation = reservation;

    next();
}

async function validateUpdateBody(req, res, next) {
	if (!req.body.data.status) {
		return next({ status: 400, message: "The body must include a status" });
	}

	if (req.body.data.status !== "booked" && req.body.data.status !== "seated" &&
		req.body.data.status !== "finished" && req.body.data.status !== "cancelled") {
		return next({ status: 400, message: `The status cannot be ${req.body.data.status}` });
	}

	if (res.locals.reservation.status === "finished") {
		return next({ status: 400, message: `A finished reservation cannot be changed` });
	}

	next();
}

async function update(req, res) {
	await service.update(res.locals.reservation.reservation_id, req.body.data.status);

	res.status(200).json({ data: { status: req.body.data.status } });
}

async function edit(req, res) {
	const response = await service.edit(res.locals.reservation.reservation_id, req.body.data);

	res.status(200).json({ data: response[0] });
}

async function read(req, res) {
	res.status(200).json({ data: res.locals.reservation });
}

module.exports = {
	list: asyncErrorBoundary(list),
	newRes: [asyncErrorBoundary(validateData), asyncErrorBoundary(validateBody), asyncErrorBoundary(validateDate), asyncErrorBoundary(newRes)],
	update: [asyncErrorBoundary(validateData), asyncErrorBoundary(validateResId), asyncErrorBoundary(validateUpdateBody), asyncErrorBoundary(update)],
	edit: [asyncErrorBoundary(validateData), asyncErrorBoundary(validateResId), asyncErrorBoundary(validateBody), asyncErrorBoundary(validateDate), asyncErrorBoundary(edit)],
	read: [asyncErrorBoundary(validateResId), asyncErrorBoundary(read)],
};