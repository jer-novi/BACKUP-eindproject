/**
 * ContactPage Component
 *
 * The contact page for the gedichtgevel.nl application.
 * Displays contact information and a contact form.
 *
 * @module pages/Contact/ContactPage
 */

/**
 * ContactPage component
 *
 * @component
 * @returns {JSX.Element} Contact page component
 */
export function ContactPage() {
    return (
        <div className="page-contact">
            <h1 className="page-title">Contact</h1>
            <p className="page-subtitle">Neem contact met ons op</p>

            <section className="contact-section">
                <h2>Stuur ons een bericht</h2>
                <p>
                    Heeft u vragen, suggesties of opmerkingen over GedichtGevel?
                    We horen graag van u!
                </p>

                <div className="contact-info">
                    <p><strong>Email:</strong> info@gedichtgevel.nl</p>
                    <p><strong>Telefoon:</strong> 06-12345678</p>
                </div>
            </section>

            <section className="contact-section">
                <h2>Samenwerken</h2>
                <p>
                    Bent u een dichter, uitgever of organisatie?
                    We staan open voor samenwerkingen om poëzie toegankelijker te maken.
                </p>
            </section>

            <section className="contact-section">
                <h2>Technische ondersteuning</h2>
                <p>
                    Voor technische vragen of problemen met de website,
                    mail naar: support@gedichtgevel.nl
                </p>
            </section>
        </div>
    )
}