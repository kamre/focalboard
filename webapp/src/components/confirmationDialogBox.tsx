// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, useCallback, useState} from 'react'
import {FormattedMessage} from 'react-intl'

import Button from '../widgets/buttons/button'

import Dialog from './dialog'
import './confirmationDialogBox.scss'

type ConfirmationDialogBoxProps = {
    heading: string
    subText?: string | ReactNode
    confirmButtonText?: string
    onConfirm: () => void
    onClose: () => void
}

export function useConfirmationDialogBox(): [boolean, ConfirmationDialogBoxProps | undefined, (props: ConfirmationDialogBoxProps) => void] {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogProps, setDialogProps] = useState<ConfirmationDialogBoxProps>()

    const showDialog = useCallback((props: ConfirmationDialogBoxProps) => {
        setDialogProps({
            ...props,
            onClose: () => setDialogVisible(false)
        })
        setDialogVisible(true)
    }, [])

    return [dialogVisible, dialogProps, showDialog]
}

type Props = {
    dialogBox: ConfirmationDialogBoxProps
}

export const ConfirmationDialogBox = (props: Props) => {
    const handleOnClose = useCallback(props.dialogBox.onClose, [])
    const handleOnConfirm = useCallback(props.dialogBox.onConfirm, [])

    return (
        <Dialog
            className='confirmation-dialog-box'
            onClose={handleOnClose}
        >
            <div
                className='box-area'
                title='Confirmation Dialog Box'
            >
                <h3 className='text-heading5'>{props.dialogBox.heading}</h3>
                <div className='sub-text'>{props.dialogBox.subText}</div>

                <div className='action-buttons'>
                    <Button
                        title='Cancel'
                        size='medium'
                        emphasis='tertiary'
                        onClick={handleOnClose}
                    >
                        <FormattedMessage
                            id='ConfirmationDialog.cancel-action'
                            defaultMessage='Cancel'
                        />
                    </Button>
                    <Button
                        title={props.dialogBox.confirmButtonText || 'Confirm'}
                        size='medium'
                        submit={true}
                        danger={true}
                        onClick={handleOnConfirm}
                        filled={true}
                    >
                        { props.dialogBox.confirmButtonText ||
                        <FormattedMessage
                            id='ConfirmationDialog.confirm-action'
                            defaultMessage='Confirm'
                        />
                        }
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ConfirmationDialogBox
export {ConfirmationDialogBoxProps}
