const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const response = await service.list();

    res.json({ data: response });
}

async function validateData(req, res, next) {
	if (!req.body.data) {
		return next({ status: 400, message: "The request body must have a data object" });
	}

	next();
}

function validateBody(req, res, next) {
    if (!req.body.data.table_name || req.body.data.table_name === "") {
        return next({ status: 400, message: "A table_name is required" });
    }

    if (req.body.data.table_name.length < 2) {
        return next({ status: 400, message: "The table_name must be at least two characters" });
    }

    if (!req.body.data.capacity || req.body.data.capacity === "") {
        return next({ status: 400, message: "A capacity is required" });
    }

    if (typeof req.body.data.capacity !== "number") {
		return next({ status: 400, message: "The capacity must be in the form of a number" });
	}

	if (req.body.data.capacity < 1) {
		return next({ status: 400, message: "The capacity must be at least 1" });
	}

    next();
}

async function newTable(req, res) {
    if (req.body.data.reservation_id) {
		req.body.data.status = "occupied";
		await service.updateRes(req.body.data.reservation_id, "seated");
	}
	else {
    	req.body.data.status = "free";
	}

    const response = await service.newTable(req.body.data);

    res.status(201).json({ data: response[0] });
}

async function validateResId(req, res, next) {
    const { reservation_id } = req.body.data;

	if (!reservation_id) {
		return next({ status: 400, message: `A reservation_id must be included` });
	}

    const reservation = await service.readRes(Number(reservation_id));

    if (!reservation) {
        return next({ status: 404, message: `That reservation ID: ${reservation_id} does not exist` });
    }

    res.locals.reservation = reservation;

    next();
}

async function validateSeat(req, res, next) {
    if (res.locals.table.status === "occupied") {
        return next({ status: 400, message: "That table is currently occupied" });
    }

	if (res.locals.reservation.status === "seated") {
		return next({ status: 400, message: "That reservation is already seated" });
	}

    if (res.locals.table.capacity < res.locals.reservation.people) {
        return next({ status: 400, message: `That table does not have the capacity to seat ${res.locals.reservation.people} people` });
    }

    next();
}

async function update(req, res) {
    await service.occupy(res.locals.table.table_id, res.locals.reservation.reservation_id);
	await service.updateRes(res.locals.reservation.reservation_id, "seated");

    res.status(200).json({ data: { status: "seated" } });
}

async function validateTableId(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (!table) {
        return next({ status: 404, message: `That table ID: ${table_id} does not exist.` });
    }

    res.locals.table = table;

    next();
}

async function validateSeatedTable(req, res, next) {
    if (res.locals.table.status !== "occupied") {
        return next({ status: 400, message: "That table is not occupied" });
    }

    next();
}

async function destroy(req, res) {
	await service.updateRes(res.locals.table.reservation_id, "finished");
    await service.free(res.locals.table.table_id);
	
    res.status(200).json({ data: { status: "finished" } });
}


module.exports = {
	list: asyncErrorBoundary(list),
	newTable: [asyncErrorBoundary(validateData), asyncErrorBoundary(validateBody), asyncErrorBoundary(newTable)],
    update: [asyncErrorBoundary(validateData), asyncErrorBoundary(validateTableId), asyncErrorBoundary(validateResId), asyncErrorBoundary(validateSeat), asyncErrorBoundary(update)],
    destroy: [asyncErrorBoundary(validateTableId), asyncErrorBoundary(validateSeatedTable), asyncErrorBoundary(destroy)],
};