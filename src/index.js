/**
 * Propmpts the user to acknowledge a modal.
 * @param {String|DOMElement|jQuery} target The modal to target
 * @param {Object} options Options to pass to acknowledge
 * @returns {Promise} A promise that resolves upon acknowledgement, rejects upon dismissal
 */
export default (target, { persist = false, scope = document } = {}) =>
	new Promise((resolve, reject) => {
		const $modal = $(scope).find(target);

		if (!$modal.length) {
			return reject(`Modal not found: ${target}`);
		}

		if (persist && $modal.data("acknowledged")) {
			return resolve();
		} else if (!persist && $modal.data("acknowledged")) {
			$modal.removeData("acknowledged");
		}

		$modal.one("hidden.bs.modal", () => {
			reject(`Acknowledgement dismissed: ${target}`);
		});

		$modal.one("click", "[data-acknowledge]", () => {
			if (persist) {
				$modal.data("acknowledged", true);
			}

			$modal
				.off("hidden.bs.modal")
				.one("hidden.bs.modal", () => resolve())
				.modal("hide");
		});

		$modal.modal("show");
	});
