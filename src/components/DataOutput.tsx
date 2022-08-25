import formStore from '~/stores/form.store';
import { type ComponentProps, createEffect, createSignal, splitProps } from 'solid-js';

type Props = Omit<ComponentProps<'output'>, 'children'> & { formId: string };

export default (props: Props) => {
	const [local, rest] = splitProps(props, ['formId']);

	const [data, setData] = createSignal(formStore.get()[local.formId]?.response);
	createEffect(() => {
		formStore.listen((value, key) => {
			if (key === local.formId) {
				if (value[key].response) {
					setData(value[key].response);
				}
			}
		});
	});

	return (
		<output {...rest}>
			<pre>{data() && JSON.stringify(data(), null, 2)}</pre>
		</output>
	);
};
