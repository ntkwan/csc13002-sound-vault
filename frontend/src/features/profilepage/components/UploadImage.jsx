import { useState, useRef, memo } from 'react';
import uploadIcon from '@assets/img/upload-icon.svg';

const UploadImage = memo(({ label, desc, className, onUpdateChange }) => {
	const [preview, setPreview] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState('');
	const formRef = useRef(null);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFileName(file.name);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (onUpdateChange && selectedFileName) {
			onUpdateChange(selectedFileName);
			formRef.current.reset();
			setSelectedFileName('');
			setPreview(null);
		}
	};

	return (
		<form ref={formRef} className={`upload__container w-full space-y-2 ${className}`} onSubmit={handleSubmit}>
			<label className="upload__label">{label}</label>
			<div className="upload__onclick relative w-44 aspect-square border-2 border-dashed rounded-xl content-center">
				{preview ? (
					<img className="upload__preview w-full h-full object-cover rounded-xl" src={preview} alt="Preview" />
				) : (
					<img className="upload__onclick-icon w-24 m-auto" src={uploadIcon} alt="Upload Icon" />
				)}
				<input
					className="upload__input absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
					type="file"
					onChange={handleImageUpload}
					accept="image/*"
				/>
			</div>
			{preview && (
				<button
					className="upload__submit-button w-20 block ml-[19%] text-sm rounded-xl bg-[#666] shadow-md
                    hover:bg-[#888] transition duration-500 ease-in-out"
					type="submit"
				>Submit
				</button>
			)}
			{!preview && (
				<span className="upload__desc inline-block text-[13px] text-[#b2b2b2]">{desc}</span>
			)}
		</form>
	);
});

export default UploadImage;
