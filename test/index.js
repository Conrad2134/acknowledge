import QUnit from "qunit";
import acknowledge from "../src/index";

// Clicks a button on a modal when it is shown and
// returns the modal as a jQuery object.
const $create = (modalId, cb, btn) =>
	$(modalId).one("shown.bs.modal", function modalShown() {
		$(this)
			.find(`[data-${btn}]`)
			.trigger("click");
		if (cb) {
			cb();
		}
	});

// Acknowledges a modal when it is shown and
// returns the modal as a jQuery object
const $acknowledge = (modalId, cb) => $create(modalId, cb, "acknowledge");

// Dismisses a modal when it is shown and
// returns the modal as a jQuery object
const $dismiss = (modalId, cb) => $create(modalId, cb, "dismiss");

QUnit.test("Simple acknowledgement", async assert => {
	const done = assert.async();
	const $modal = $acknowledge("#modal-one");

	try {
		await acknowledge("#modal-one");
		assert.notOk($modal.hasClass("in show"), "Modal should be acknowledged and closed");
		done();
	} catch (err) {
		// We shouldn't be here.
	}
});

QUnit.test("Simple dismissal", async assert => {
	const done = assert.async();
	const $modal = $dismiss("#modal-one");

	try {
		await acknowledge("#modal-one");
	} catch (err) {
		assert.notOk($modal.hasClass("in show"), "Modal should be dismissed and closed");
		done();
	}
});

QUnit.test("Outside click dismissal", async assert => {
	const done = assert.async();
	const $modal = $("#modal-one");

	// When the modal opens, click the overlay to close the modal
	$modal.one("shown.bs.modal", () => {
		$modal.trigger("click");
	});

	try {
		await acknowledge("#modal-one");
	} catch (err) {
		assert.notOk($modal.hasClass("in show"), "Modal should be dismissed and closed");
		done();
	}
});

QUnit.test("Dismiss and acknowledge", async assert => {
	const done = assert.async(2);

	$dismiss("#modal-one");

	try {
		await acknowledge("#modal-one");
	} catch (err) {
		assert.ok(err, "Modal should be dismissed");
		done();
	}

	$acknowledge("#modal-one");

	try {
		await acknowledge("#modal-one");
		assert.ok(true, "Modal should be acknowledged");
		done();
	} catch (err) {
		console.error(err);
		// We shouldn't be here.
	}
});

QUnit.test("Multiple acknowledgements", async assert => {
	const done = assert.async();

	$acknowledge("#modal-one");
	$acknowledge("#modal-two");

	try {
		await acknowledge("#modal-one");
		await acknowledge("#modal-two");
		assert.ok(true, "Both modals were acknowledged");
		done();
	} catch (err) {
		// We shouldn't be here.
	}
});

QUnit.test("Scope", async assert => {
	const done = assert.async();

	$acknowledge("#modal-one");

	try {
		await acknowledge("#modal-one", { scope: "#qunit" });
	} catch (err) {
		assert.ok(err, "Modal should not be found");
		done();
	}
});

QUnit.test("Acknowledge and dismiss, don't persist", async assert => {
	const done = assert.async(6);

	$acknowledge("#modal-one", done);
	$dismiss("#modal-two", done);

	try {
		await acknowledge("#modal-one");
		await acknowledge("#modal-two");
	} catch (err) {
		assert.ok(err, "First modal should be acknowledged, second should be dismissed.");
		done();
	}

	$acknowledge("#modal-one", done);
	$dismiss("#modal-two", done);

	try {
		await acknowledge("#modal-one");
		await acknowledge("#modal-two");
	} catch (err) {
		assert.ok(err, "First modal should be acknowledged again, second should be dismissed.");
		done();
	}
});

QUnit.test("Persistance", async assert => {
	const done = assert.async(5);

	const $modal1 = $acknowledge("#modal-one", done);
	$dismiss("#modal-two", done);

	try {
		await acknowledge("#modal-one", { persist: true });
		await acknowledge("#modal-two", { persist: true });
	} catch (err) {
		assert.ok(true, "First modal should be acknowledged, second should be dismissed.");
		assert.ok($modal1.data("acknowledged"), "First modal should have acknowledgement be persisted.");
		done();
	}

	$acknowledge("#modal-one", done);
	$dismiss("#modal-two", done);

	try {
		await acknowledge("#modal-one", { persist: true });
		await acknowledge("#modal-two", { persist: true });
	} catch (err) {
		assert.ok(true, "First modal shouldn't be acknowledged (saved), second should be dismissed.");
		done();
	}
});

QUnit.test("Remove persistance", async assert => {
	const done = assert.async(4);
	const $modal = $acknowledge("#modal-one", done);

	try {
		await acknowledge("#modal-one", { persist: true });
		assert.ok($modal.data("acknowledged"), "Modal should be acknowledged and acknowledgement should be persisted");
		done();
	} catch (err) {
		// Shouldn't be here.
	}

	$acknowledge("#modal-one", done);

	try {
		await acknowledge("#modal-one", { persist: false });
		assert.notOk($modal.data("acknowledged"), "Modal should be acknowledged and acknowledgement should not be persisted");
		done();
	} catch (err) {
		// Shouldn't be here.
	}
});
