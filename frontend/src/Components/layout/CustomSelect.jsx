import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

/**
 * CustomSelect - A premium styled react-select component matching the dark theme.
 * 
 * @param {Array} options - Array of { value, label } objects.
 * @param {Object} value - The currently selected option object { value, label }.
 * @param {Function} onChange - Callback function(selectedOption).
 * @param {String} placeholder - Placeholder text.
 * @param {Boolean} isDisabled - Whether the select is disabled.
 * @param {Boolean} isMulti - Whether multiple selections are allowed.
 * @param {Object} props - Any other react-select props.
 */
const CustomSelect = ({
    options = [],
    value = null,
    onChange,
    placeholder = "Zgjidh...",
    isDisabled = false,
    isMulti = false,
    isCreatable = false,
    ...props
}) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: state.isFocused ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
            minHeight: '48px',
            borderRadius: '0.5rem',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.2s ease',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 1rem',
        }),
        input: (provided) => ({
            ...provided,
            color: 'var(--color-text-main)',
            fontFamily: 'Quicksand, sans-serif',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.2)',
            fontFamily: 'Quicksand, sans-serif',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDisabled ? 'var(--color-text-dim)' : '#ffffff',
            fontFamily: 'Quicksand, sans-serif',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            zIndex: 999999,
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 999999,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '4px',
            '::-webkit-scrollbar': {
                width: '6px',
            },
            '::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
                background: 'var(--color-primary-dark)',
                borderRadius: '3px',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'var(--color-primary)'
                : state.isFocused
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'transparent',
            color: state.isSelected ? '#ffffff' : 'var(--color-text-main)',
            cursor: 'pointer',
            borderRadius: '0.375rem',
            padding: '10px 12px',
            fontFamily: 'Quicksand, sans-serif',
            '&:active': {
                backgroundColor: 'var(--color-primary-light)',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isFocused ? 'var(--color-primary)' : 'var(--color-text-muted)',
            '&:hover': {
                color: 'var(--color-primary-light)',
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'var(--color-text-muted)',
            '&:hover': {
                color: 'var(--color-red-500)',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderRadius: '4px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'var(--color-indigo-100)',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'var(--color-indigo-100)',
            '&:hover': {
                backgroundColor: 'var(--color-red-500)',
                color: '#ffffff',
            },
        }),
    };

    const Component = isCreatable ? CreatableSelect : Select;

    return (
        <Component
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isMulti={isMulti}
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: 'var(--color-primary)',
                },
            })}
            {...props}
        />
    );
};

export default CustomSelect;
