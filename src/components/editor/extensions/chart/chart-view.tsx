import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ChartEditDialog } from "./chart-edit-dialog";
import { ChartRenderer } from "./chart-renderer";
import { ChartData, parseChartData } from "./common";

export function ChartView({ editor, getPos, node }: ReactNodeViewProps) {
  const [chartData, setChartData] = useState<ChartData>();
  const [openChartEditDialog, setOpenChartEditDialog] = useState(false);
  const [error, setError] = useState<string>();

  const deleteNode = useCallback(() => {
    const pos = getPos();
    if (pos === undefined) {
      return;
    }

    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.delete(pos, pos + node.nodeSize);
        return true;
      })
      .run();
  }, [editor, getPos, node]);

  const renderChart = useCallback(async () => {
    try {
      const parsed = JSON.parse(node.textContent);
      const result = parseChartData(parsed);
      if (!result.success) {
        throw Error(result.error.message);
      }

      setChartData(result.data);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  }, [node]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  return (
    <NodeViewWrapper>
      {error ? (
        <div className="w-full p-2">
          <Alert variant="destructive" className="mt-10">{error}</Alert>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center aspect-video p-2">
          <ChartRenderer chartData={chartData} />
        </div>
      )}

      <div className="absolute flex space-x-1 top-2 right-2">
        <Button
          variant="secondary"
          size="icon"
          className="opacity-40 hover:opacity-100 size-7 bg-zinc-300! text-zinc-700!"
          onClick={() => setOpenChartEditDialog(true)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="opacity-40 hover:opacity-100 size-7 bg-red-600!"
          onClick={deleteNode}
        >
          <Trash2Icon />
        </Button>
      </div>
      <ChartEditDialog
        value={node.textContent}
        isOpen={openChartEditDialog}
        onOpenChange={setOpenChartEditDialog}
        onInsert={(data) => {
          const pos = getPos();
          if (pos === undefined) {
            return;
          }

          editor.chain().focus().setNodeSelection(pos).setChart({ data }).run();
          setOpenChartEditDialog(false);
        }}
      />
    </NodeViewWrapper>
  );
}
