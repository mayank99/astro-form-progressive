import formStore from '~/stores/form.store';
import { type ComponentProps, createEffect, createSignal, splitProps, Show } from 'solid-js';

type Props = Omit<ComponentProps<'output'>, 'children'> & { formId: string };

export default (props: Props) => {
	const [local, rest] = splitProps(props, ['formId']);

	const [data, setData] = createSignal(formStore.get()[local.formId]);
	createEffect(() => {
		formStore.listen((value, key) => {
			if (key === local.formId) {
				setData(value[key]);
			}
		});
	});

	return (
		<output {...rest}>
			<Show when={data()}>
				<em>{data().pending ? 'Loading...' : data().response ? 'Response:' : ''}</em>
				<pre>
					{data().pending
						? `Submission: ${JSON.stringify(data().pending)}`
						: data().response
						? JSON.stringify(data().response, null, 2)
						: ''}
				</pre>
			</Show>
		</output>
	);
};
