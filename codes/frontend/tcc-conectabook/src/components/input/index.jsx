import './input.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Input({ label, placeholder, value, onChange, type = "text", name, required, faIcon, className }) {
    return (
        <div className='input-group'>
            <div className="label">
                <FontAwesomeIcon icon={faIcon} />
                <label>{label}</label>
            </div>
            <input
                className={className}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default Input