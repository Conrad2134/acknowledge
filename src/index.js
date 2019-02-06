/**
 * Propmpts the user to acknowledge a modal.
 * @param {String|DOMElement|jQuery} target The modal to target
 * @param {Object} options Options to pass to acknowledge
 * @returns {Promise} A promise that resolves upon acknowledgement, rejects upon dismissal
 */
export default (target, { persist = false, scope = document, keepOpen = false, before = () => {} } = {}) =>
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

		$modal.on("click.acknowledge", "[data-acknowledge]", async () => {
			try {
				const b = before();

				b && b.then && (await b);
			} catch (ex) {
				// `before` rejected - skipping acknowledgement and leaving modal open.
				return;
			}

			if (persist) {
				$modal.data("acknowledged", true);
			}

			$modal.off("click.acknowledge").off("hidden.bs.modal");

			if (keepOpen) {
				resolve();
			} else {
				$modal.one("hidden.bs.modal", () => resolve()).modal("hide");
			}
		});

		$modal.modal("show");
	});
