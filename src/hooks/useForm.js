import { useState } from 'react';

export const useForm = ({ initialValues, validate = () => ({}), onSubmit, resetOnSuccess = false }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors(({ [name]: _cleared, ...rest }) => rest); // rest: remove só o erro do campo editado
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const result = await onSubmit(values);
      if (result !== false && resetOnSuccess) setValues(initialValues);
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, submitting, handleChange, handleSubmit };
};
