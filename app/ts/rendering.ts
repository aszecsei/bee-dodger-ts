export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D, deltaTime: number): void;
}

export interface IComponent extends IDrawable {
    update(deltaTime: number): void;
}
