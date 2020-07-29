import * as React from 'react';
import { Alert, Ref } from '@fluentui/react-northstar';

export type ReaderTextProps = {
  selector: string;
};

const AOMDisabledMessage =
  'Accessible Object Model (AOM) feature is not enable. For more information on how to enable it, access https://wicg.github.io/aom/caniuse.html';

export const ReaderText: React.FunctionComponent<ReaderTextProps> = ({ selector }) => {
  const ref = React.createRef<HTMLElement>();
  const [text, setText] = React.useState('');
  const [AOMWarning, setAOMWarning] = React.useState(false);

  React.useEffect(() => {
    const getComputedAccessibleNode = async () => {
      if (ref.current) {
        const element = ref.current.ownerDocument.querySelector(selector);
        let t = element?.textContent || '';

        if (!!window.getComputedAccessibleNode) {
          const accessibleNode = await window.getComputedAccessibleNode(element);
          console.log(`name: ${accessibleNode.name} - role: ${accessibleNode.role}`, accessibleNode);
          t = `${accessibleNode.role} ${accessibleNode.name}`;
        } else {
          setAOMWarning(true);
        }

        setText(t);
      }
    };

    getComputedAccessibleNode();
    // eslint-disable-next-line
  }, [setText, ref.current, selector]);

  if (!selector) {
    return null;
  }

  return (
    <Ref innerRef={ref}>
      <>
        <Alert warning content={text} />
        {AOMWarning && <Alert warning content={AOMDisabledMessage} />}
      </>
    </Ref>
  );
};
