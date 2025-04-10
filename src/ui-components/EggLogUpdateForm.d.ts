/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type EggLogUpdateFormInputValues = {
    sub?: string;
    date?: string;
    eggsCollected?: number;
    chickenFlockID?: string;
};
export declare type EggLogUpdateFormValidationValues = {
    sub?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    eggsCollected?: ValidationFunction<number>;
    chickenFlockID?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EggLogUpdateFormOverridesProps = {
    EggLogUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    eggsCollected?: PrimitiveOverrideProps<TextFieldProps>;
    chickenFlockID?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EggLogUpdateFormProps = React.PropsWithChildren<{
    overrides?: EggLogUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    eggLog?: any;
    onSubmit?: (fields: EggLogUpdateFormInputValues) => EggLogUpdateFormInputValues;
    onSuccess?: (fields: EggLogUpdateFormInputValues) => void;
    onError?: (fields: EggLogUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EggLogUpdateFormInputValues) => EggLogUpdateFormInputValues;
    onValidate?: EggLogUpdateFormValidationValues;
} & React.CSSProperties>;
export default function EggLogUpdateForm(props: EggLogUpdateFormProps): React.ReactElement;
