


HTMLFormElement.prototype.addAjaxSaveOnSubmit = function (config = {}){

	let form = this;

	form.addEventListener('submit', async (event) => {

		event.preventDefault();

		let formData = new FormData(form);

		try {

			let response = await fetch(form.action, {
				method: form.method,
				body: formData
			});
			
			let msg = await response.text();
			
			if(response.status !== 200) throw JSON.parse(msg);

			if(config.success){
				config.success();
			} else {
				window.location.reload();
			}
			
			return msg;
	
		} catch (error) {			
			console.error(error);
			if(config.failure) {
				config.failure(); 
			} else {
				alert(error.message);
			}
		}
	});
	
}

	