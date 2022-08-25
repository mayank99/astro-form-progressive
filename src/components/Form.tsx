import { type ComponentProps, splitProps } from 'solid-js';
import formStore from '~/stores/form.store';

type Props = Omit<ComponentProps<'form'>, 'onSubmit'> & {
	onSubmit?: (e: SubmitEvent) => void;
	formId: string;
};

export default (props: Props) => {
	const [local, rest] = splitProps(props, ['action', 'children', 'onSubmit', 'formId', 'method']);

	return (
		<form
			method={local.method || 'post'}
			onSubmit={async (e) => {
				local.onSubmit?.(e);
				if (!e.defaultPrevented) {
					e.preventDefault();
					const formData = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
					formStore.setKey(local.formId, { pending: formData });

					try {
						const returnedResponse = await fetch(local.action || '/', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(formData),
						});

						if (returnedResponse.ok) {
							const processedData = await returnedResponse.json();
							formStore.setKey(local.formId, { pending: null, response: processedData });
						} else {
							console.error(returnedResponse.text());
							formStore.setKey(local.formId, {
								pending: null,
								response: null,
								error: returnedResponse.text(),
							});
						}
					} catch (error) {
						console.error(error);
					}
				}
			}}
			{...rest}
		>
			{local.children}
		</form>
	);
};
