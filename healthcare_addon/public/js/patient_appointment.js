frappe.ui.form.on('Healthcare Practitioner Contribution Table', {
	document_type: function (frm, cdt, cdn) {
		let row = locals[cdt][cdn]
		frappe.db.get_doc('Healthcare Practitioner', row.document_type)
			.then(doc => {
				const practitionerCommission = doc.healthcare_practitioner_commission.find(commission => commission.document_type === frm.doctype);
				if (practitionerCommission) {
					switch (practitionerCommission.preferred_commission_type) {
						case "Fixed Amount":
							row.is_fixed_amount = true;
							row.fixed_amount = practitionerCommission.fixed_amount;
							row.percentage = 0;
							row.practitioner_commission_account = doc.practitioner_commission_account;
							break;
						case "Percentage":
							row.is_percentage = true;
							row.fixed_amount = 0;
							row.percentage = practitionerCommission.percentage;
							row.practitioner_commission_account = doc.practitioner_commission_account;
							break;
						default:
						// handle default case
					}
					frm.refresh();
				}
			}).catch(err => {
				frappe.msgprint({
					title: __('Error'),
					message: __('Unable to fetch practitioner document: {0}', [err.message])
				});
			}
			);
	}
});


frappe.ui.form.on('Patient Appointment', {
	refresh(frm) {
		if (!frm.doc.__islocal && frm.doc.references_table.length == 0) {
            frm.add_custom_button(__('Submit Je'), function () {
                frappe.call({
                    method: 'healthcare_addon.utils.utils.create_appointment_commission_je',
                    args: {
                        doc_type: frm.doctype,
                        docname: frm.docname,
                    },
                    freeze: true,
                    freeze_message: __('Clearing'),
                    callback: function (r) {
                        frm.refresh();
                    }
                }).then(window.location.reload());
            }).addClass('btn-primary');
        }
	},
})

