import { map } from 'nanostores';

const formStore = map<{
	[k: string]: { response?: unknown; pending?: unknown; error?: unknown };
}>();

export default formStore;
