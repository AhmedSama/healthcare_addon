import frappe
from frappe import _
from healthcare_addon.utils.utils import create_commission_je, cancel_references_table_docs, calculate_practitioner_contribution


def before_save(doc, method):
    rate = get_service_rate(doc)
    calculate_practitioner_contribution(doc, rate=rate)


def after_delete(doc, method) -> None:
    cancel_references_table_docs(doc)


def on_update(doc, method):
    rate = get_service_rate(doc)
    calculate_practitioner_contribution(doc, rate=rate)


def get_service_rate(doc):
    service_items = frappe.get_doc('Appointment Type', doc.appointment_type)
    for item in service_items.items:
        if item.medical_department == doc.department:
            rate = item.op_consulting_charge
            break
    return rate