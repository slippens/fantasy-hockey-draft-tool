import clsx from 'clsx';
import * as React from 'react';

export interface DataTableHeading {
    align?: 'left' | 'center' | 'right' | string;
    title: string;
}

interface DataTableProps {
    children?: React.ReactNode;
    headings?: DataTableHeading[];
}

interface RowProps {
    children?: React.ReactNode;
}

interface CellProps {
    align?: 'left' | 'center' | 'right';
    children?: React.ReactNode;
    collapsing?: boolean;
    colSpan?: number;
    flush?: boolean;
}

const DataTable = ({ children, headings = [] }: DataTableProps): JSX.Element => (
    <div className="relative overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        {headings.map((heading, index) => {
                            const styles = clsx(
                                'p-2 border-b text-xs font-medium text-gray-800',
                                (!heading.align || heading.align === 'left') && 'text-left',
                                heading.align === 'right' && 'text-right',
                                heading.align === 'center' && 'text-center',
                            );

                            return (
                                <th key={index} className={styles}>
                                    {heading.title}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {children}
                </tbody>
            </table>
        </div>
    </div>
);

const Row = ({ children }: RowProps): JSX.Element => (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
        {children}
    </tr>
);

const Cell = (props: CellProps): JSX.Element => {
    const {
        align,
        children,
        collapsing = false,
        colSpan,
        flush = false,
    } = props;

    const styles = clsx(
        collapsing && 'w-px',
        !flush && 'p-2',
        'text-sm whitespace-nowrap',
    );

    return (
        <td
            align={align}
            colSpan={colSpan}
            className={styles}
        >
            {children}
        </td>
    );
};

DataTable.Cell = Cell;
DataTable.Row = Row;

export default DataTable;