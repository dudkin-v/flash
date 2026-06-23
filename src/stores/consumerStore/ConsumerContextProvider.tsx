import {
    useCallback,
    useState,
    useMemo,
    type PropsWithChildren,
} from 'react';
import { consumers } from '../../consumers';
import { ConsumerContext, type ConsumerContextValue } from './consumerContext';

export function ConsumerContextProvider(props: PropsWithChildren) {
    const [selectedConsumer, setSelectedConsumer] = useState<ConsumerContextValue['selectedConsumer']>(consumers[0]);

    const selectConsumer: ConsumerContextValue['selectConsumer'] = useCallback((key) => {
        const newConsumer = consumers.find((consumer) => consumer.key === key);

        if (newConsumer) {
            setSelectedConsumer(newConsumer);
        }
    }, []);

    const contextValue = useMemo(() => {
        return {
            selectedConsumer,
            selectConsumer,
        };
    }, [selectedConsumer, selectConsumer]);

    return (
        <ConsumerContext.Provider value={contextValue}>
            {props.children}
        </ConsumerContext.Provider>
    );
}
